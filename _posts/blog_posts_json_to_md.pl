#!/usr/bin/perl
#
# Export blog posts from current site database:
# localhost:$ ssh deploy@athega.se
# deploy@athega:$ cd /var/www/vhosts/assets.athega.se/data/athega_se
# deploy@athega:$ ./export_database_to_ndjson_and_json.sh
# deploy@athega:$ exit
#
# Fetch and convert blog posts to markdown files:
# localhost:$ cd _posts
# localhost:$ curl -O https://assets.athega.se/data/athega_se/blog_posts.json
# localhost:$ ./blog_posts_json_to_md.pl blog_posts.json

use strict;
use JSON;

my $posts = from_json(join('', <>));

foreach my $post (@$posts) {

    my $file = $post->{slug};
    $file =~ s/\W+/-/g;
    $file .= '.md';

    print $file, "\n";

    my $date = sprintf "%4.4d-%2.2d-%2.2d", $post->{year}, $post->{month}, $post->{day};
    my @tags = ();
    @tags = @{$post->{tags_array}} if ref $post->{tags_array} eq 'ARRAY';

    foreach my $field ('content', 'image_url') {
        $post->{$field} =~ s((https?://(www\.)?athega\.se)?/system/uploads/)(/assets/legacy/uploads/)g;
    }

    open MD, '>', $file or die $!;
    print MD "---\n";
    print MD "title: \"", $post->{title}, "\"\n" if $post->{title};
    print MD "date: ", $date, "\n";
    print MD "description: \"", $post->{summary}, "\"\n" if $post->{summary};
    print MD "tags:\n", map("  - $_\n", @tags) if @tags;
    print MD "last_updated_by: ", $post->{last_updated_by}, "\n" if $post->{last_updated_by};
    print MD "image_url: ", $post->{image_url}, "\n" if $post->{image_url};
    print MD "---\n";
    print MD $post->{content}, "\n";
    close MD;
}
